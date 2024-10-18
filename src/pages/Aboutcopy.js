import React from "react";
import { Box, Typography } from "@mui/material";

function About() {
  return (
    <Box style={{ padding: "20px" }}>
      <Typography variant="h5" style={{ flexGrow: 1 }}>
        COPYRIGHT
      </Typography>
      <ul>
        <li>
          Re Aidan Stonehouse from{" "}
          <a
            style={{ textDecoration: "none", color: "inherit" }}
            href="https://thenounproject.com/browse/icons/term/reciept/"
            target="_blank"
            title="Reciept Icons"
          >
            Noun Project
          </a>{" "}
          (CC BY 3.0)
        </li>
        <li>
          Category by adi_sena from{" "}
          <a
            style={{ textDecoration: "none", color: "inherit" }}
            href="https://thenounproject.com/browse/icons/term/category/"
            target="_blank"
            title="Category Icons"
          >
            Noun Project
          </a>{" "}
          (CC BY 3.0)
        </li>
        <li>
          members by Alena Artemova from{" "}
          <a
            style={{ textDecoration: "none", color: "inherit" }}
            href="https://thenounproject.com/browse/icons/term/members/"
            target="_blank"
            title="members Icons"
          >
            Noun Project
          </a>{" "}
          (CC BY 3.0)
        </li>
        <li>
          product by Lusi Astianah from{" "}
          <a
            style={{ textDecoration: "none", color: "inherit" }}
            href="https://thenounproject.com/browse/icons/term/product/"
            target="_blank"
            title="product Icons"
          >
            Noun Project
          </a>{" "}
          (CC BY 3.0)
        </li>
      </ul>
    </Box>
  );
}

export default About;
