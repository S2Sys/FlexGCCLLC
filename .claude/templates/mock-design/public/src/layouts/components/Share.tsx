import config from "@/config/config.json";
import {
  IoLogoFacebook,
  IoLogoLinkedin,
  IoLogoPinterest,
  IoLogoTwitter,
} from "react-icons/io5";

const Share = ({
  title,
  description,
  slug,
  className,
}: {
  title: string;
  description?: string;
  slug: string;
  className?: string;
}) => {
  const { base_url } = config.site;

  return (
    <ul className={className}>
      <li className="inline-block">
        <a
          aria-label="facebook share button"
          href="#!"
          rel="noreferrer noopener"
        >
          <IoLogoFacebook />
        </a>
      </li>
      <li className="inline-block">
        <a
          aria-label="twitter share button"
          href="#!"
          rel="noreferrer noopener"
        >
          <IoLogoTwitter />
        </a>
      </li>
      <li className="inline-block">
        <a
          aria-label="linkedin share button"
          href="#!"
          rel="noreferrer noopener"
        >
          <IoLogoLinkedin />
        </a>
      </li>
      <li className="inline-block">
        <a
          aria-label="pinterest share button"
          href="#!"
          rel="noreferrer noopener"
        >
          <IoLogoPinterest />
        </a>
      </li>
    </ul>
  );
};

export default Share;
