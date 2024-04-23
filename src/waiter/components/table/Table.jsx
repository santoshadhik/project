import { NavLink } from "react-router-dom";

const Table = (props) => {
  return (
    <>
      <NavLink to={`/waiter/table/${props.id}`}>
        <div className="bg-[#008000] shadow-md shadow-blue-200 text-white rounded-2xl h-20 py-3 px-5 sm:px-15">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">{props.name}</h1>
          </div>
        </div>
      </NavLink>
    </>
  );
};

export default Table;
