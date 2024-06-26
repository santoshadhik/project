import { NavLink } from "react-router-dom";

const PageNotFound = () => {
  return (
    <>
      <div className="w-full h-screen bg-gray-100">
        <div className="flex items-center justify-center h-screen">
          <div>
            <h1 className="text-9xl  text-gray-400 font-bold text-center">
              404
            </h1>
            <h3 className="pt-5 text-xl max-w-sm text-center text-gray-700">
              Sorry, we couldn't find the page you were looking for.
            </h3>
            <h4 className="py-1 pb-3 max-w-sm text-center text-gray-400">
              But don't worry, you can find plenty of other things on our
              homepage.
            </h4>
            <div className="flex items-center justify-center">
              <NavLink to="/">
                <button className="px-10 py-2 bg-indigo-500 text-white hover:bg-indigo-700 rounded-md shadow-md">
                  Back to homepage
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageNotFound;
