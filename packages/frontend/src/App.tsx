import PWABadge from "./PWABadge.tsx";
import "./App.css";

import { DatabaseProvider } from "./db/provider.tsx";
import ShopList from "./pages/ShopList.tsx";
import { ErrorBoundary } from "react-error-boundary";

function renderError(error: unknown) {
  return <div>Something went wrong: {String(error)}</div>;
}

function App() {
  return (
    <>
      <div className="flex flex-col h-full justify-between">
        <header>
          <div className="navbar bg-primary shadow-sm">
            <div className="flex-1">
              <a className="btn btn-ghost text-xl">Cookie</a>
            </div>
            <div className="flex gap-2">
              {/* <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" /> */}
              {/* <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path> </svg>
                </div>
                <ul
                  tabIndex={-1}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                  <li>
                    <a className="justify-between">
                      Profile
                      <span className="badge">New</span>
                    </a>
                  </li>
                  <li><a>Settings</a></li>
                  <li><a>Logout</a></li>
                </ul>
              </div> */}
            </div>
          </div>
        </header >
        <main className="p-4 grow self-center w-full md:w-3xl">
          <ErrorBoundary fallbackRender={({ error }) => renderError(error)}>
            <DatabaseProvider>
              <ShopList />
            </DatabaseProvider>
          </ErrorBoundary>
        </main>
        <PWABadge />
      </div >
    </>
  );
}

export default App;
