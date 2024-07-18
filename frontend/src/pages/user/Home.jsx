import Feed from '../../components/user/Feed';
import Discussions from '../../components/user/Discussions';

const Home = () => {
  return (
    <div className="w-full flex flex-wrap md:flex-nowrap">
      <div className="w-full md:w-4/5">
        <Feed />
      </div>
      <div className="w-full md:w-1/5">
        <Discussions />
      </div>
    </div>
  );
}

export default Home;
