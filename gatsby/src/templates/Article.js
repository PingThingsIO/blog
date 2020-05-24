import { Author, Byline, Caption as BaseCaption, Code as BaseCode, Tag as BaseTag, Excerpt, Media as BaseMedia } from 'frontend-components'
import { Container as BaseContainer } from '../components/Container'
import { Layout } from './Layout'
import { get, map } from 'lodash'
import { graphql } from 'gatsby'
import React from 'react'
import rehypeReact from 'rehype-react'
import styled, { th } from '@xstyled/styled-components'

const Caption = styled(BaseCaption)`
  margin-top: 64px;
`;

const Code = styled(BaseCode)`
  margin: 64px 0;
`

const Content = styled.div`
  ${th('typography.body4')};
`

const Container = styled(BaseContainer)`
  margin-top: 64px;
`

const Header = styled.h2`
  margin: 64px 0;
`

const Media = styled(BaseMedia)`
  margin: 64px 0;
`;

const RelatedPost = styled.div`
  display: flex:
  flex-direction: column;
  flex: 1;

  & + div {
    margin-left: 32px;
  }
`

const RelatedPostContainer = styled(Container)`
  display: flex;
`;

const RelatedPostMedia = styled(Media)`
  margin-bottom: 24px;
`

const Tag = styled(BaseTag)`
  margin-right: 16px;
`

const Subtitle = styled.p`
  ${th('typography.display1')};

  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  color: neutral5;
  display: -webkit-box;
  line-height: 30px;
  margin-bottom: 76px;
  margin-top: 40px;
  overflow: hidden;
`

const Title = styled.h1`
  ${th('typography.display4')};
  color: neutral8;
  line-height: 0;
`;

const Article = ({ data, location }) => {
  const post = data.markdownRemark

  const parseContent = new rehypeReact({
    createElement: React.createElement,
    components: {
      'h2': ({ children }) => <Header>{children}</Header>,
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

  const byline = {
    author: {
      ...author,
      avatar
    },
    date: get(post, 'frontmatter.date')
  }

  return (
    <Layout location={location}>
      <Container>
        <Title>{get(post, 'frontmatter.title')}</Title>
        <Subtitle>{get(post, 'frontmatter.description')}</Subtitle>

        <Byline {...byline} />
      </Container>

      <Caption image={get(post, 'frontmatter.featuredImage')} size='large' />

      <Container>
        <Content>{parseContent(post.htmlAst)}</Content>

        {map(get(post, 'frontmatter.tags'), (tag, key) => <Tag key={key}label={tag} />)}
      </Container>

      <RelatedPostContainer>
        {map(get(post, 'fields.relatedPosts'), relatedPost => {
          const author = get(relatedPost, 'author.avatar', false);
          let avatar;

          if (author) {
            avatar = {
              image: get(relatedPost, 'author.avatar'),
              size: '48'
            }
          }

          return (
            <RelatedPost>
              <RelatedPostMedia source={get(relatedPost, 'frontmatter.featuredImage')} size='small' />

              <Excerpt author={author} date={get(relatedPost, 'frontmatter.date')} title={get(relatedPost, 'frontmatter.title')} subtitle={get(relatedPost, 'frontmatter.description')} />
            </RelatedPost>
          )
        })}
      </RelatedPostContainer>

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
        relatedPosts {
          author {
            avatar
            bio
            name
          }
          frontmatter {
            date
            description
            featuredImage
            tags
            title
          }
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
