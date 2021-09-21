package main

import (
	"log"
	"net/http"
	"sort"

	"github.com/bwmarrin/discordgo"
	"github.com/itfactory-tm/thomas-bot/pkg/embed"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/thomasmorebe/discord-hub/pkg/data"

	"github.com/meyskens/go-hcaptcha"

	"github.com/spf13/cobra"
)

const emailChannel = "889939643506786334"

func init() {
	rootCmd.AddCommand(NewServeHTTPCmd())
}

type serveHTTPCmdOptions struct {
	Token              string
	HCaptchaSiteKey    string
	HCaptchaSiteSecret string
	BindAddr           string

	hc   *hcaptcha.HCaptcha
	data *data.DataGetter
}

// NewServeHTTPCmd generates the `serve-http` command
func NewServeHTTPCmd() *cobra.Command {
	s := serveHTTPCmdOptions{}
	c := &cobra.Command{
		Use:     "serve",
		Short:   "Run the HTTP server",
		Long:    `This startes the HTTP server for the join page`,
		RunE:    s.RunE,
		PreRunE: s.Validate,
	}

	c.Flags().StringVarP(&s.Token, "token", "t", "", "Discord bot token")
	c.Flags().StringVarP(&s.HCaptchaSiteKey, "hcaptcha-site-key", "k", "", "HCaptcha site key")
	c.Flags().StringVarP(&s.HCaptchaSiteSecret, "hcaptcha-site-secret", "s", "", "HCaptcha site secret")
	c.Flags().StringVarP(&s.BindAddr, "bind-addr", "a", ":8080", "Bind address")

	c.MarkFlagRequired("token")
	c.MarkFlagRequired("hcaptcha-site-key")
	c.MarkFlagRequired("hcaptcha-site-secret")

	return c
}

func (s *serveHTTPCmdOptions) Validate(cmd *cobra.Command, args []string) error {
	return nil
}

func (s *serveHTTPCmdOptions) RunE(cmd *cobra.Command, args []string) error {
	var err error
	s.hc = hcaptcha.New(s.HCaptchaSiteSecret)
	s.data, err = data.NewDataGetter()
	if err != nil {
		return err
	}

	// set up HTTP server with echo
	e := echo.New()
	// handle cors
	e.Use(middleware.CORS())

	// serve static files
	e.Static("/", "./www")

	e.POST("/api/servers/:guild/join", s.handleInvite)
	e.POST("/api/waitlist", s.handleWaitlist)
	e.GET("/api/servers", s.handleGetServers)
	e.GET("/api/tags", s.handleGetTags)

	// start HTTP server
	return e.Start(s.BindAddr)
}

func (s *serveHTTPCmdOptions) handleWaitlist(c echo.Context) error {
	ip := c.Request().Header.Get("CF-Connecting-IP")
	if ip == "" {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "not proxied correct"})
	}

	data := struct {
		Email        string `json:"email"`
		Campus       string `json:"campus"`
		Programme    string `json:"programme"`
		HcapthaToken string `json:"h-captcha-response"`
	}{}
	c.Bind(&data)

	if data.HcapthaToken == "" {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "h-captcha-response is required"})
	}

	if !s.verifyCaptcha(ip, data.HcapthaToken) {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "h-captcha-response is invalid"})
	}

	e := embed.NewEmbed()
	e.SetTitle("new signup for waitlist")
	e.AddField("email", data.Email)
	e.AddField("campus", data.Campus)
	e.AddField("programme", data.Programme)

	dg, err := discordgo.New("Bot " + s.Token)
	if err != nil {
		log.Println(err)
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Cannot connect to Discord"})
	}

	dg.ChannelMessageSendEmbed(emailChannel, e.MessageEmbed)

	return c.JSON(http.StatusOK, echo.Map{"status": "ok"})
}

func (s *serveHTTPCmdOptions) handleInvite(c echo.Context) error {
	guildID := c.Param("guild")
	if guildID == "" {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "guild id is required"})
	}

	server := s.data.GetServer(guildID)
	if server == nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "guild not found"})
	}

	ip := c.Request().Header.Get("CF-Connecting-IP")
	if ip == "" {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "not proxied correct"})
	}

	data := struct {
		HCaptcheResponse string `json:"h-captcha-response"`
	}{}
	c.Bind(&data)
	if data.HCaptcheResponse == "" {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "h-captcha-response is required"})
	}

	if !s.verifyCaptcha(ip, data.HCaptcheResponse) {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "h-captcha-response is invalid"})
	}

	dg, err := discordgo.New("Bot " + s.Token)
	if err != nil {
		log.Println(err)
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Cannot connect to Discord"})
	}

	i, err := dg.ChannelInviteCreate(server.InviteChannelID, discordgo.Invite{
		MaxUses: 2,       // failsafe for some incorrect uses
		MaxAge:  60 * 60, // 1 hour
		Unique:  true,
	})
	if err != nil {
		log.Println(err)
	}

	log.Printf("Invited user with code %q for guild %q from IP %s", i.Code, guildID, ip)
	return c.JSON(http.StatusOK, echo.Map{"invite": i.Code})
}

func (s *serveHTTPCmdOptions) handleGetServers(c echo.Context) error {
	servers := s.data.GetServers()
	// sort servers by order
	sort.Slice(servers, func(i, j int) bool {
		return servers[i].Order < servers[j].Order
	})
	return c.JSON(http.StatusOK, servers)
}

func (s *serveHTTPCmdOptions) handleGetTags(c echo.Context) error {
	return c.JSON(http.StatusOK, s.data.GetAllTags())
}

func (s *serveHTTPCmdOptions) verifyCaptcha(ip, cResponse string) bool {
	resp, err := s.hc.Verify(cResponse, ip)
	if err != nil {
		log.Println(err)
		return false
	}
	return resp.Success
}
