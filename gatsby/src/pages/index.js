import { Excerpt } from 'frontend-components'
import { Layout } from "../templates/Layout"
import { Link, graphql } from "gatsby"
import { get } from 'lodash'
import React from "react"
import styled from '@xstyled/styled-components'

const ArticleList = styled.div`
  margin: 64px 0;

  @media (min-width: 1100px) {
    width: 1000px;
  }
`;

const ArticleItem = styled(Link)`
  display: flex;
  margin-top: 64px;
  text-decoration: none;

  @media (max-width: 1000px) {
    margin-top: 128px;
  }
`;

const Homepage = ({ data, location, ...props }) => {
  const [first, ...posts] = data.allMarkdownRemark.edges.filter(item => !item.node.fields.slug.includes('/about') && !item.node.fields.slug.includes('/authors'))
  
  const firstPost = {
    ...first.node.frontmatter,
    image: first.node.frontmatter.featuredImage,
    subtitle: first.node.excerpt
  }

  return (
    <Layout location={location}>
      <Link to={get(first, 'node.fields.slug')}>
        <Excerpt {...firstPost} layout='extended' />
      </Link>

      <ArticleList>
        {posts.map(({ node }, index) => {
          const data = {
            ...node.frontmatter,
            image: node.frontmatter.featuredImage,
            subtitle: node.excerpt
          }

          return (
            <ArticleItem key={index} to={get(node, 'fields.slug')}>
              <Excerpt {...data} />
            </ArticleItem>
          )
        })}
      </ArticleList>
    </Layout>
  )
}

export default Homepage

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      filter: { fields: { category: { eq: "post" } } }
      sort: { fields: [frontmatter___date], order: DESC }
      ) {
      edges {
        node {
          html
          excerpt
          fields {
            author {
              avatar
              name
            }
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            featuredImage
            title
            description
          }
        }
      }
    }
  }
`