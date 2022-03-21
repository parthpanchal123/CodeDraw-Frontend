module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        bg: `url('images/header.png')`,
        together: `url('images/together.png')`,
        collab: `url('images/collab.png')`,
      }),
      fontFamily: {
        body: ["Poppins"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
