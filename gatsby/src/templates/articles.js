import { Excerpt, Pagination } from 'frontend-components'
import { Layout } from "./Layout"
import { Link, graphql, navigate } from "gatsby"
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

const Articles = ({ data, location, pageContext }) => {
  const posts = data.allMarkdownRemark.edges
  const { currentPage, numPages } = pageContext

  const onChangePage = item => {
    const path = item === 1 ? '/articles' : `/articles/${item}`

    navigate(path)
  }

  return (
    <Layout location={location}>
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

      <Pagination currentPage={currentPage} onClick={item => onChangePage(item)} totalPages={numPages} />
    </Layout>
  )
}

export default Articles

export const pageQuery = graphql`
  query($skip: Int, $limit: Int) {
    allMarkdownRemark(
      filter: { fields: { category: { eq: "post" } } }
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
      ) {
      edges {
        node {
          excerpt
          fields {
            category
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