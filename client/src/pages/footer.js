import React from 'react';
import { AiFillFacebook, AiFillInstagram, AiFillYoutube, AiOutlineTwitter } from 'react-icons/ai';

const Footer = () => {
  return (
    <div className="footer-container bg-[#F8D1E2] fixed bottom-0 left-0 right-0">
      <p className="text-center py-4">2023 Party Planner Paperie All rights reserved</p>
      <div className="flex justify-center pb-4">
        <AiFillInstagram className="text-3xl mx-3" />
        <AiOutlineTwitter className="text-3xl mx-3" />
        <a href="https://www.youtube.com/results?search_query=party+planner+paperie" target="_blank" rel="noreferrer">
          <AiFillYoutube className="text-3xl mx-3" />
        </a>
        <AiFillFacebook className="text-3xl mx-3" />
      </div>
    </div>
  );
}

export default Footer;
