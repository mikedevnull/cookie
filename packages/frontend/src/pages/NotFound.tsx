import { MainLayout } from "./Layout";

export function NotFound() {
    return <MainLayout>
        <div className="text-center">
            <h3 className="text-base pt-8 text-accent">404</h3>
            <h1 className="text-7xl pb-8 text-primary">Page not found</h1>
            <h4 className="italic text-lg">I'm sorry, we could not find the page you are looking for</h4>
        </div>
    </MainLayout>
}