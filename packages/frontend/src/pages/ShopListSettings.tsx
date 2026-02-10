import { useNavigate, useParams } from "react-router";
import { MainLayout } from "./Layout";
import { useShopList } from "../hooks/useShoplist";
import { CategoryEditor } from "../components/category-editor";
import { addNewCategory, changeCategoryLabel, deleteCategory, moveCategory } from "../db/utilts";

export function ShopListSettings() {
    const { shoplistId } = useParams();
    const { itemList, isFetching } = useShopList(shoplistId ?? '0')
    const navigate = useNavigate()

    if (isFetching) {
        return <></>;
    }
    if (!itemList) {
        navigate('/404')
        return <></>
    }


    return <MainLayout backLink="..">
        <section>
            <h3>Categories</h3>
            <CategoryEditor categories={itemList.categories}
                onReorder={(moveId, relativeToId) => { moveCategory(moveId, relativeToId, itemList) }}
                onEdit={(id: string, newLabel: string) => { changeCategoryLabel(newLabel, id, itemList) }}
                onAdd={function (newLabel: string): void { addNewCategory(newLabel, itemList) }}
                onDelete={(id) => deleteCategory(id, itemList)} />
        </section>
    </MainLayout>
}