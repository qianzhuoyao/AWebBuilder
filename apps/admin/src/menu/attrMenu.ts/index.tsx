/**
 * slot 的属性菜单
 */

export const SlotAttrMenu = () => {
  return (
    <div
      style={{
        position: 'absolute',
        right: '0px',
      height:'100%',
        zIndex: 2,
      }}
    >
      <ul
        className="menu menu-lg bg-base-200 w-56"
        style={{
          height:'100%',
          width: '320px',
        }}
      >
        <li>
          <a>lg item 1</a>
        </li>
        <li>
          <a>lg item 2</a>
        </li>
      </ul>
    </div>
  );
};
