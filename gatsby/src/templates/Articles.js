import { Excerpt, Pagination } from 'frontend-components'
import { Layout } from "./Layout"
import { Link, graphql, navigate } from "gatsby"
import { get } from 'lodash'
import React from "react"
import styled, { css, up, th } from '@xstyled/styled-components'

const ArticleList = styled.div`
  margin-top: 20px;

  ${up('lg',
    css`
      width: 1000px;
    `
  )}
`;

const ArticleItem = styled(Link)`
  display: flex;
  margin-bottom: 64px;
  text-decoration: none;
`;

const Title = styled.h3`
  ${th('typography.display3')}
  margin-bottom: 64px;
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
        <Title>Recent Articles</Title>

        {posts.map(({ node }, index) => {
          console.log(node);
          const author = get(node, 'fields.author')
          let avatar;

          if (author) {
           avatar = {
             image: get(author, 'avatar'),
             size: '48'
           };
          }

          const data = {
            ...node.frontmatter,
            author: {
              ...author,
              avatar
            },
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
            author {
              avatar
              name
            }
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