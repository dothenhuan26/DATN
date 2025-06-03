import React from 'react';

const About = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-green-500 to-teal-600">
      <div className="w-full h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8">
            Về Chúng Tôi
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto">
            Tìm hiểu thêm về công ty và sứ mệnh của chúng tôi. Chúng tôi cam kết tạo ra những trải nghiệm tuyệt vời cho người dùng.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About; 