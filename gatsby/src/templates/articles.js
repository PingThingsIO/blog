import { Excerpt, Pagination } from 'frontend-components'
import { Layout } from "./Layout"
import { Link, graphql, navigate } from "gatsby"
import { get } from 'lodash'
import React from "react"
import styled from '@xstyled/styled-components'

const ArticleList = styled.div`
  margin-top: 64px;
  width: 1000px;
`;

const ArticleItem = styled(Link)`
  margin-top: 64px;
`

const Articles = ({ data, location, pageContext }) => {
  const posts = data.allMarkdownRemark.edges.filter(item => !item.node.fields.slug.includes('/about') && !item.node.fields.slug.includes('/authors'))
  const { currentPage, numPages } = pageContext

  const getFirstImage = content => {
    const [_, image] = /<img\b[^>]+?src\s*=\s*['"]?([^\s'"?#>]+)/g.exec(content) || [];

    return image || ''
  }

  const onChangePage = item => {
    const path = item === 1 ? '/articles' : `/articles/${item}`

    navigate(path)
  }

  return (
    <Layout location={location}>
      <ArticleList>
        {posts.map(({ node }, index) => {
          const image = getFirstImage(node.html);

          const data = {
            ...node.frontmatter,
            image,
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
            title
            description
          }
        }
      }
    }
  }
`
