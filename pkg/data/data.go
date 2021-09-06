package data

import (
	"encoding/json"
	"os"
)

type DataGetter struct {
	data Data
}

type Data struct {
	Servers map[string]Server `json:"servers"`
}

type Server struct {
	GuildID         string   `json:"guildID"`
	Name            string   `json:"name"`
	BannerURL       string   `json:"bannerURL"`
	InviteChannelID string   `json:"inviteChannelID"`
	Description     string   `json:"description"`
	Order           int      `json:"order"`
	Tags            []string `json:"tags"`
}

func NewDataGetter() (*DataGetter, error) {
	f, err := os.Open("data.json")
	if err != nil {
		return nil, err
	}

	data := Data{}
	err = json.NewDecoder(f).Decode(&data)
	if err != nil {
		return nil, err
	}

	return &DataGetter{data: data}, nil
}

func (d *DataGetter) GetServer(guildID string) *Server {
	for _, server := range d.data.Servers {
		if server.GuildID == guildID {
			return &server
		}
	}

	return nil
}

func (d *DataGetter) GetServers() []Server {
	servers := make([]Server, 0, len(d.data.Servers))
	for _, server := range d.data.Servers {
		servers = append(servers, server)
	}

	return servers
}

func (d *DataGetter) GetAllTags() []string {
	var tags []string
	for _, server := range d.data.Servers {
		tags = append(tags, server.Tags...)
	}

	return tags
}
