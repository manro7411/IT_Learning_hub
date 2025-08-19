type BannerProps = {
    useremail:string;
    overallScore:number;
}

const PointBanner = ({overallScore} : BannerProps) => {
    return(
        <div className="bg-blue-700 text-white rounded-xl p-6 bg-[url('/src/assets/backgroundcourse.png')] bg-cover">
        <div className="text-sm uppercase">Point Overview</div>
            <div className="text-2xl font-semibold mt-2 flex items-center space-x-2">
                <span>Reward Points</span>
                <span className="text-yellow-300 text-3xl">⭐</span>
                <span className="text-3xl font-bold">{overallScore}</span>
            </div>
        </div>
    )
    
}
export default PointBanner