import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
 
const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["200", "400", "700", "800"],
    variable: "--font-jakarta",
  });
const inter = Inter({
    subsets: ["latin"],
    weight: ["200", "400", "700", "800"],
    variable: "--font-inter",
  });
 

export { inter, jakarta }