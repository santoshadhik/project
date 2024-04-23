import { RiDeleteBinLine } from "react-icons/ri";

const DeleteButton = ({ click }) => {
  return (
    <>
      <div>
        <button className="text-2xl text-red-600" onClick={click}>
          <RiDeleteBinLine />
        </button>
      </div>
    </>
  );
};

export default DeleteButton;
