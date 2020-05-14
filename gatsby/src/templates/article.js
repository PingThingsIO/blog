import { Author, Caption, Code as BaseCode, Tag as BaseTag, Excerpt, Media } from 'frontend-components'
import { Container as BaseContainer } from '../components/Container'
import { Layout } from './Layout'
import { get, map } from 'lodash'
import { graphql } from 'gatsby'
import React from 'react'
import rehypeReact from 'rehype-react'
import styled, { th } from '@xstyled/styled-components'

const Code = styled(BaseCode)`
  margin: 64px 0;
`

const Content = styled.div`
  ${th('typography.body4')};
`

const Container = styled(BaseContainer)`
  margin-top: 64px;
`

const Tag = styled(BaseTag)`
  margin-right: 16px;
`

const Title = styled.h2`
  margin: 64px 0;
`

const Article = ({ data, pageContext, location }) => {
  const post = data.markdownRemark

  const parseContent = new rehypeReact({
    createElement: React.createElement,
    components: {
      'h2': ({ children }) => <Title>{children}</Title>,
      'img': ({ src }) => <Media source={src} />,
      'pre': ({ children }) => {
        const { className, children: childrenProps } = children[0].props;
        const language = (className || '').replace('language-', '');
        
        return <Code language={language} snippet={childrenProps[0]} />
      } 
    }, 
  }).Compiler

  
  const author = get(post, 'fields.author')
  const avatar = {
    image: get(author, 'avatar'),
    size: '48'
  };
  
  const excerpt = {
    author: {
      ...author,
      avatar
    },
    date: get(post, 'frontmatter.date'),
    title: get(post, 'frontmatter.title'),
    subtitle: get(post, 'frontmatter.description')
  }
  
  return (
    <Layout location={location}>
      <Container>
        <Excerpt {...excerpt} />
      </Container>

      <Caption image={get(post, 'frontmatter.featuredImage')} size='large' />

      <Container>
        <Content>{parseContent(post.htmlAst)}</Content>

        {map(get(post, 'frontmatter.tags'), (tag, key) => <Tag key={key}label={tag} />)}
      </Container>

      <Container>
        <Author author={{ ...author, avatar: { ...avatar, size: '76' }}} />
      </Container>
    </Layout>
  )
}

export default Article

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt
      htmlAst
      fields {
        author {
          avatar
          bio
          name
        }
      }
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        description
        featuredImage
        tags
        title
      }
    }
  }
`
