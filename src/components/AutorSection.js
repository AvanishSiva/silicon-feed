import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faGoogle } from '@fortawesome/free-brands-svg-icons';
import ghost from "../assets/pfp/ghost.jpg"

const AuthorSection = (props) => {
    console.log(props)
  return (
    <div className="bg-white py-2 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Author Section */}
        <div className="flex items-center mt-6 bg-white p-6 rounded-lg">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <img
                className="w-16 h-16 rounded-full object-cover transition-transform duration-300 hover:scale-110"
                src={ghost}
                alt="Author"
            />
          </div>

          {/* Author Info */}
          <div className="ml-4">
            <h3 className="text-xl font-bold">{props.author.name}</h3>
            <p className="text-gray-600 text-sm">{props.author.description}</p>
            <div className="flex items-center mt-2 space-x-4">
              {/* Social Icons */}
              <a
                href={`mailto:${props.author.handlers.mail}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-red-500"
              >
                <FontAwesomeIcon icon={faGoogle} size="lg" />
              </a>
              <a
                href={props.author.handlers.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-black"
              >
                <FontAwesomeIcon icon={faGithub} size="lg" />
              </a>
              <a
                href={props.author.handlers.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-700"
              >
                <FontAwesomeIcon icon={faLinkedin} size="lg" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorSection;
