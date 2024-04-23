const AddButton = (props) => {
  return (
    <div>
      <button className="bg-[#f0a151] hover:bg-[#f1ba83] text-white py-2 px-4 rounded-full shadow-md">
        {props.name}
      </button>
    </div>
  );
};

export default AddButton;
