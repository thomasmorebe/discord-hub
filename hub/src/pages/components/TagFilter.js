import { useEffect, useState } from "react";
import { Col, Badge } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function TagFilter({ filterCallback }) {
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedtags] = useState([]);

  useEffect(() => {
    fetch("https://camplus.club/api/tags")
      .then(res => res.json())
      .then(data => {
        setTags(data);
      });
  }, []);

  const handleTagClick = tag => {
    let newTags = selectedTags;
    if (selectedTags.includes(tag)) {
      newTags = selectedTags.filter(t => t !== tag);
    } else {
      newTags = [...selectedTags, tag];
    }

    if (filterCallback) {
      filterCallback(newTags);
    }

    setSelectedtags(newTags);
  };

  const getBG = tag => {
    if (selectedTags.length === 0) {
      return "primary";
    }

    return selectedTags.includes(tag) ? "primary" : "primary-faded";
  };

  const { t } = useTranslation();

  return (
    <>
      <Col xs={12}>
        <h4>{t("filter_tags")}</h4>
      </Col>
      <Col xs={12} className="mb-3">
        {tags.map(tag => (
          <Badge pill bg={getBG(tag)} className="mx-1" onClick={() => handleTagClick(tag)} key={`filter-${tag}`} style={{ cursor: "pointer" }}>
            {tag}
          </Badge>
        ))}
      </Col>
    </>
  );
}

export default TagFilter;
