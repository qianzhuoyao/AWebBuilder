export const LayerMenu = () => {
  return (
    <div
      style={{
      
        left: '0px',
        height:'100%',
        zIndex: 2,
      }}
    >
      <ul
        className="menu menu-lg bg-base-200 w-56"
        style={{
          width: '320px',
          height:'100%',
        }}
      >
        <li className="ellipsis-text">
          <a className="ellipsis-text">lg item 112e12e1212e12e12e12e11111111111111</a>
        </li>
        <li className="ellipsis-text">
          <a className="ellipsis-text">lg item 2</a>
        </li>
      </ul>
    </div>
  );
};
