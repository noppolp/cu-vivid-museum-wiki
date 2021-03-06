
import React from 'react'

const HeroImage = ({ category, heroImageURL, children, small }) => {
  let style = { }
  if (heroImageURL) {
    style = Object.assign(style, { backgroundImage: `url(${heroImageURL})`, backgroundSize: 'cover', backgroundPosition: 'center center' })
  }
  if (small) {
    style.height = 250
  }
  return (
    <div className='background-wrap' style={style}>
      <div className='children-wrap'>
        {children}
      </div>
      <div className='category-title'>
        {category}
      </div>
      <style jsx>{`
                .children-wrap {
                  position: relative;
                  z-index: 2;
                  padding: 10px 10px;
                  max-width: 1024px;
                  width: 100%;
                  margin: 0 auto;
                }
                .category-title{
                  color: white;
                  font-size: 38px;
                  width: 100%;
                  max-width: 1024px;
                  text-align: right;
                  z-index: 2;
                  padding: 0 25px;
                  position: relative;
                  font-weight: bold;
                }
                .background-wrap {
                  display:flex;
                  flex-direction: column;
                  justify-content:center;
                  align-items: center;
                    height: 350px;
                    position: relative;
                    margin-top: -80px;
                    padding-top: 80px;

                    background-color: rgba(50,84,26,0.4);
                }
                .background-wrap:after {
                  content: " ";
                  width: 100%;
                  height: 100%;
                  top:0;
                  left:0;
                  position: absolute;
                  z-index: 0;
                  background-color: rgba(50,84,26,0.4);
                }
                @media screen and (max-width: 670px) {
                  .background-wrap{
                    margin-top: -90px;
                    padding-top: 90px;
                  }
                }
    `}</style>
    </div>
  )
}
export default HeroImage
