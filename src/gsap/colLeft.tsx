import { Controls, PlayState, Tween } from 'react-gsap';
/**
 * 向左边收纳
//  */
// export const CollapseLeftGsap = () => {
//   return (
//     <Controls playState={PlayState.stop}>
//       <Tween
//         to={{ x: "200px" }}
//         duration={2}
//         ease={(x) =>
//           x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2
//         }
//       >
//         <div style={{ width: "100px", height: "100px", background: "#ccc" }} />
//       </Tween>
//     </Controls>
//   );
// };
