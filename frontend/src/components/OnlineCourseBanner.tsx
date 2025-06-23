import bgImage from '../assets/backgroundcourse.png';

const OnlineCourseBanner = () => {
  return (
    <div
      className="rounded-xl p-6 text-white bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="mb-4">
        <div className="text-sm font-light">ONLINE COURSE</div>
        <div className="text-2xl font-semibold mt-1">
          Your journey to smarter learning starts here.
        </div>
      </div>
      <button className="bg-orange-400 hover:bg-orange-500 text-white font-medium px-4 py-2 rounded-full">
        Join Now ▶
      </button>
    </div>
  );
};

export default OnlineCourseBanner;
