import type React from "react"

type Props = {
    menuItems?: React.JSX.Element
}



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

    return <header className="navbar bg-primary shadow-sm text-primary-content">
        <div className="flex-1">
            <a className="btn btn-ghost text-xl">Cookie</a>
        </div>
        <div className="flex gap-2">
            {/* <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" /> */}
            {dropDownMenu}
        </div>
    </header >
}