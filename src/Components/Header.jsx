import "../Styles/Header.css"
import {Link} from 'react-router-dom'
 
import logo from "../assets/kmclu-logo.png"

export default function Header() {
  return (
    <div id="header">
        <img src= {logo} alt="KMCLU image" />
        <span><Link  to={'/'} >Home</Link></span>
        <span><Link  to={'/Upload'} >Upload</Link></span>
        <span><Link  to={'/Discussion'} >Discussion</Link></span>

    </div>
  )
}
