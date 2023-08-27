import React from 'react'
import './index.css';
const Footer = () => {
    const year = new Date().getFullYear();
  return (
    <footer>
            <h3>Made with ❤️ in India ({year})</h3>
            <div className = "more">
                <a href="https://github.com/tanujajoshi1">Github</a>
                <a href="https://www.linkedin.com/in/tanuja-joshi-b3a179193/">LinkedIn</a>
                <a href="https://www.behance.net/tanujajoshi">Behance</a>
                <a href="https://tanujajoshi-55510.web.app/">Portfolio</a>
            </div>
          
        </footer>
  )
}

export default Footer
