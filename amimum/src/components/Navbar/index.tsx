import Icon from "../Icon";

const Navbar = () => {
    
  return (
    <div className="flex flex-col gap-4 fixed bottom-0 right-0 left-0 bg-white mx-auto" style={{ maxWidth: '400px', width: '100%' }}>
      <div className="shadow-box">
        <div className="flex justify-center items-center gap-16 h-14">
          <div>
            <Icon icon="home" />
          </div>
          <div>
            <Icon icon="heart" />
          </div>
          <div>
            <Icon icon="wallet" />
          </div>
          <div>
            <Icon icon="account" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
