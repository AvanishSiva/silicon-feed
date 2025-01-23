import React, {useEffect} from 'react';
import NavBar from '../components/NavBar';
import { useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import AuthorSection from '../components/AutorSection';

const ArticlePage = () => {

    const location = useLocation();
    const data = location.state;

    useEffect(() => {
        window.scrollTo(0, 0); 
      }, []);

  return (
    <div className="pt-16">
      <NavBar />

      {/* Full-screen div */}
      <div className="h-screen flex flex-col">
        <div
          className="h-3/4 bg-fixed bg-center"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/29871288/pexels-photo-29871288/free-photo-of-vintage-apple-computers-display-in-tokyo.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
          }}
        ></div>

        {/* Title and Description (1/4 of the screen) */}
        <div className="flex items-center justify-center h-1/4 bg-white p-6 sm:p-8">
          <div className="text-center max-w-full sm:max-w-2xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-black mb-4">
              {data.title}
            </h1>
            <p className="italic text-base font-extralight sm:text-lg text-black">
                {data.description}
            </p>
          </div>
        </div>
      </div>

      {/* Full content section (title + description + main content) */}
      <div className="bg-white py-12 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          {/* <h2 className="text-4xl font-semibold text-black mb-6">Exploring the Future</h2> */}
          {data.contents.map((content, index) => (
                
                <p className="text-lg text-gray-700 mb-4">
                    {content}
                </p>
          ))}
        </div>
        <AuthorSection author = {data.author}></AuthorSection>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default ArticlePage;
