import React from 'react'
import Article from './Article'

const Feed = () => {
  return (
    <main className="flex-1 p-4">
      <Article 
        author="Fauzudheen"
        title="REST vs. gRPC: Choosing the Right Communication Protocol for Microservices"
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
        reactions="23"
        comments="5"
        readTime="4"
      />
      <Article 
        author="Abhinand K"
        title="Leveraging Kubernetes for Microservices Deployment"
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
        reactions="15"
        comments="6"
        readTime="6"
      />
      <Article 
        author="Hamraz Hakeem"
        title="Continuous Integration and Continuous Deployment: Automating Your Workflow"
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
        reactions="15"
        comments="6"
        readTime="6"
      />
    </main>
  )
}

export default Feed
