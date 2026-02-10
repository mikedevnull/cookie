import { useTransition } from "react"
import type { Category } from "../db/schema"

type ItemCategorySelectorProps = {
    availableCategories: Category[]
    currentCategory?: string
    action?: (newCategory: string) => Promise<void>
}


export function ItemCategorySelector(props: ItemCategorySelectorProps) {

    const [isPending, startTransition] = useTransition()
    const handleCategorySelected = (categoryId: string) => {
        startTransition(async () => {
            if (props.action) {
                await props.action(categoryId)
            }
        })
    }

    if (isPending) {
        return <></>
    }

    return <dialog open={props.currentCategory !== undefined} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
            <h3 className="text-lg font-bold">Select category:</h3>
            <ul className="menu bg-base-100 rounded-box shadow-md w-full">
                {props.availableCategories.map(c => <li key={c.id}><a className={props.currentCategory === c.id ? "bg-primary" : ""} onClick={() => handleCategorySelected(c.id)}>{c.label}</a></li>)}
                <li><a className={props.currentCategory === "" ? "bg-primary" : ""} onClick={() => handleCategorySelected("")}>Other</a></li>
            </ul>
            <div className="modal-action">
                <form method="dialog" className="modal">
                    <button className="btn">Close</button>
                </form>
            </div>
        </div>
    </dialog>
}