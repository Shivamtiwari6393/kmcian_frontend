import "../Styles/Header.css"
import {Link} from 'react-router-dom'
export default function Header() {
  return (
    <div id="header">
        <img src=".\src\assets\kmclu-logo.png" alt="KMCLU image" />
        <span><Link  to={'/'} >Home</Link></span>
        <span><Link  to={'/Papers'} >Papers</Link></span>
        <span><Link  to={'/Upload'} >Upload</Link></span>
        <span><Link  to={'/Discussion'} >Discussion</Link></span>

    </div>
  )
}
