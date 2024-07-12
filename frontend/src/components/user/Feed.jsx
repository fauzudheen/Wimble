import React, { useEffect, useState } from 'react'
import Article from './Article'
import axios from 'axios'
import { GatewayUrl } from '../const/urls'

const Feed = () => {

  const [articles, setArticles] = useState([])

  useEffect(() => {
    const fetchArticleDetails = async () => {
      console.log("fetching article details")
      try {
        const response = await axios.get(`${GatewayUrl}api/articles/`)
        console.log("response", response.data)
        setArticles(response.data.results)
      } catch (error) {
        console.error("Error fetching article details", error)
      }
    };

    fetchArticleDetails();
  }, [])

  return (
    <main className="flex-1 p-4">
      {articles.map((article) => (
    article.user_data ? (
      <Article
        key={article.id}
        id={article.id}
        profile={article.user_data.profile}
        author={`${article.user_data.first_name} ${article.user_data.last_name}`}
        tagline={article.user_data.tagline}
        thumbnail={article.thumbnail}
        title={article.title}
        content={article.content}
        created_at={article.created_at}
        likesCount={article.likes_count}
        commentsCount={article.comments_count}
      />
    ) : null
  ))}
    </main>
  )
}

export default Feed
