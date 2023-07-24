const Footer = () => {
  const today = new Date();
  return (
    <footer>
      <p>Copyright &copy; {today.getUTCFullYear()}</p>
    </footer>
  );
};

export default Footer;
