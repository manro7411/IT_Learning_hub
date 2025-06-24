type PostCardProps = {
    user: string;
    email: string;
    time: string;
    title: string;
    message: string;
    views: number;
    comments: number;
    likes: number;
};

const PostCardWidget = ({
                            user,
                            email,
                            time,
                            title,
                            message,
                            views,
                            comments,
                            likes,
                        }: PostCardProps) => {
    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3" />
                <div>
                    <div className="text-sm font-semibold">{email}</div>
                    <div className="text-xs text-gray-500">{user}</div>
                    <div className="text-xs text-gray-400">{time}</div>
                </div>
            </div>


            <div className="text-base font-semibold text-gray-800">{title}</div>
            <div className="text-sm text-gray-600 mt-1 whitespace-pre-line">{message}</div>


            <div className="flex gap-2 text-xs text-gray-400 mt-3">
                <span>👁 {views}</span>
                <span>💬 {comments}</span>
                <span>⬆️ {likes}</span>
            </div>
        </div>
    );
};

export default PostCardWidget;
