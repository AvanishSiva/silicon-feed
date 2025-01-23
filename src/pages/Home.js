import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ParticleNetwork from "../components/ParticleNetwork";
import "./Home.css"
import ArticleList from "../components/ArticleList";

const Home = () => {



    // const posts = [
    //     {
    //         title: "Steve Jobs : A Crazy Person",
    //         image: "https://images.pexels.com/photos/29871288/pexels-photo-29871288/free-photo-of-vintage-apple-computers-display-in-tokyo.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    //         author: {
    //             name : "Sivaavanish K",
    //             description : "Software Developer",
    //             handlers : {
    //                 mail : "sivaavanishk@gmail.com",
    //                 github : "https://github.com/AvanishSiva",
    //                 linkedIn : "https://www.linkedin.com/in/sivaavanish-k-5b6899203/"
    //             }
    //         },
    //         description: "A story of how Steve Jobs transformed skepticism into groundbreaking success, inspiring his team to achieve the impossible.",
    //         contents :[
    //             {para : "In the early 1980s, Steve Jobs had a dream: to create a computer that would redefine the way people interacted with technology. He envisioned the Macintosh not just as a tool but as a piece of art—beautiful, intuitive, and accessible to everyone. At the time, this vision seemed audacious, even impossible. Apple was still a young company, and the technological limitations of the era were daunting. Yet, Jobs believed deeply in his vision, even when others doubted it."},
    //             {para : "Jobs gathered his team and shared his dream, but not everyone shared his optimism. The engineers saw the obstacles: tight deadlines, limited resources, and the challenge of making a computer that was both revolutionary and affordable. Many thought the task was impossible. They had every reason to think so—after all, no one had ever built anything like what Jobs was describing."},
    //             {para : "But Jobs was not one to be deterred by doubt. In a meeting that would become the stuff of legend, he addressed the skepticism head-on. “Don’t be afraid,” he said, his voice calm but resolute. “The people who are crazy enough to think they can change the world are the ones who do.” Those words, simple yet profound, ignited a spark in his team. It wasn’t just a statement; it was a challenge—a call to rise above their own perceived limitations."},
    //             {para : "Jobs had an uncanny ability to make people believe in the impossible. He didn’t just give instructions; he created a vision so compelling that his team couldn’t help but buy into it. He reframed every obstacle as an opportunity and painted a picture of what the Macintosh could mean for the world. “This isn’t just a computer,” he told them. “This is a tool for the mind—a bicycle for the brain.”"},
    //             {para : "The Macintosh project became a masterclass in determination and creativity. Jobs pushed his team relentlessly, but he also inspired them. When they said something couldn’t be done, he challenged them to rethink. He pushed them to innovate, to experiment, and to believe in their abilities. And slowly, what once seemed impossible began to take shape."},
    //             {para : "When the Macintosh was finally unveiled in 1984, it was a triumph of design and engineering. Its graphical user interface and mouse made it unlike anything the world had seen before. The Macintosh didn’t just meet expectations—it shattered them. It became a symbol of what could happen when belief, vision, and effort aligned."},
    //             {para : "Steve Jobs’ journey with the Macintosh is more than just a story about technology; it’s a story about human potential. It’s a reminder that the limits we see are often self-imposed, and that belief—both in ourselves and in our vision—can break through those limits. Jobs showed that the spark of an idea, nurtured with courage and conviction, can ignite a revolution."}
    //         ]
    //     }
    // ];

    return (
        <div className="pt-16">
            <NavBar></NavBar>

            <div className="relative min-h-screen">
                <ParticleNetwork />
                
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-sans text-gray-800 leading-tight max-w-3xl z-10 absolute left-0 top-1/2 transform -translate-y-1/2">
                    Because Even Developers Need Something to Read Besides Stack Overflow!
                </h2>
                
                {/* Additional content div */}
                <div className="relative z-10">
                    {/* Other content goes here */}
                </div>
            </div>


            <div className="pt-16">
                <ArticleList />
            </div>


            <Footer></Footer>
        </div>

    );
}

export default Home;