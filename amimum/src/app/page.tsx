import Icon from "@/components/Icon";
import Search from "@/components/Search";

const Homepage = () => {
  return (
    <main>
      {/* Header */}
      <div>
        <div className="flex justify-between items-center mt-14 mx-6">
          <div className="flex flex-col justify-center gap-2">
            <p>Selamat Datang,</p>
            <h4 className="font-bold text-xl font-jakarta">Nama User</h4>
          </div>

          <div className="flex justify-center items-center gap-3">
            <Icon icon="bag2" />
            <Icon icon="notification" />
          </div>
        </div>

        <div className="mx-6 mt-6">
          <Search />
        </div>
      </div>
    </main>
  );
};

export default Homepage;
