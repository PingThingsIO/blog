import { Layout } from "./Layout"
import { Link, graphql } from "gatsby"
import React from "react"

const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark
  const { previous, next } = pageContext


  return (
    <Layout location={location}>
      <article>
        <header>
          <h1>
            {post.frontmatter.title}
          </h1>
          <p>{post.frontmatter.date}</p>
        </header>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>

      {post.fields.author && (
        <div className="custom-section author-bio mid-gray">
          <h3>About the author</h3>

          <div className="image-bio-section">
            <div className="left">
              <img src={post.fields.author.avatar} className="img" />
            </div>

            <div className="right">
              <h4>{post.fields.author.name}</h4>

              <p>{post.fields.author.bio}</p>
            </div>
          </div>
        </div>
      )}

      <nav>
        <ul>
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt
      html
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
        title
      }
    }
  }
`
