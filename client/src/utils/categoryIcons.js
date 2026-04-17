import {
  FaNewspaper, FaLaptop, FaFootballBall, FaFilm, FaChartLine,
  FaShoppingCart, FaHashtag, FaGraduationCap, FaHeartbeat, FaPlane,
  FaFolder, FaFlag, FaGlobe, FaLandmark, FaCode, FaMicrochip,
  FaRobot, FaBasketballBall, FaFutbol, FaVideo, FaMusic, FaTv,
  FaChartBar, FaBitcoin, FaUniversity,
} from 'react-icons/fa'

const iconMap = {
  FaNewspaper,
  FaLaptop,
  FaFootballBall,
  FaFilm,
  FaChartLine,
  FaShoppingCart,
  FaHashtag,
  FaGraduationCap,
  FaHeartbeat,
  FaPlane,
  FaFolder,
  FaFlag,
  FaGlobe,
  FaLandmark,
  FaCode,
  FaMicrochip,
  FaRobot,
  FaBasketballBall,
  FaFutbol,
  FaVideo,
  FaMusic,
  FaTv,
  FaChartBar,
  FaBitcoin,
  FaUniversity,
}

export function getCategoryIcon(iconName) {
  return iconMap[iconName] || FaFolder
}

export default iconMap
