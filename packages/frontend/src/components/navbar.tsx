import type React from "react"
import { Link } from "react-router"

type Props = {
    menuItems?: React.JSX.Element
    backLink?: string
}

const BackIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 stroke-current">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
</svg>


export function NavBar(props: Props) {
    let dropDownMenu = <></>
    if (props.menuItems) {
        dropDownMenu = <div className="dropdown dropdown-left">
            <div tabIndex={0} role="button" aria-label="Page menu toggle" className="btn btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path> </svg>
            </div>
            {props.menuItems}
        </div>
    }

    const backLink =
        props.backLink ?
            <div className="flex-none">
                <Link to={props.backLink} className="btn btn-square btn-ghost">
                    {BackIcon}
                </Link>
            </div>
            : <div className="h-10 w-10 flex-none" />


    return <header className="navbar bg-primary shadow-sm text-primary-content">
        {backLink}

        <div className="flex-1">
            <a className="btn btn-ghost text-xl">Cookie</a>
        </div>
        <div className="flex gap-2">
            {/* <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" /> */}
            {dropDownMenu}
        </div>
    </header >
}