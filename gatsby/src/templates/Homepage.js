import { Link as BaseLink, graphql, navigate } from "gatsby"
import { Excerpt, Pagination } from 'frontend-components'
import { Layout } from "./Layout"
import { get } from 'lodash'
import React from "react"
import styled, { css, down, up } from '@xstyled/styled-components'

const Link = styled(BaseLink)`
  text-decoration: none;
`

const ArticleList = styled.div`
  margin-top: 64px;

  ${up('xl',
    css`
      width: 1000px;
    `
  )}
`;

const ArticleItem = styled(BaseLink)`
  display: flex;
  margin-bottom: 64px;
  text-decoration: none;

  ${down('lg',
    css`
      margin-top: 128px;
    `
  )}
`;

const Homepage = ({ data, location, pageContext, ...props }) => {
  const { currentPage, numPages } = pageContext
  const [first, ...posts] = data.allMarkdownRemark.edges;

  const onChangePage = item => {
    const path = item === 1 ? '/articles' : `/articles/${item}`

    navigate(path)
  }

  const author = get(first, 'node.fields.author')
  let avatar;

  if (author) {
    avatar = {
      image: get(author, 'avatar'),
      size: '48'
    };
  }

  const firstPost = {
    ...first.node.frontmatter,
    author: {
      ...author,
      avatar
    },
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

export default Homepage

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