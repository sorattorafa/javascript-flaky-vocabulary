// https://github.com/microsoft/fluentui/blob/00b6694e2bd2f1de1713f9303fdff5dd63fcda9e/packages/office-ui-fabric-react/src/components/List/List.test.tsx 

// blob: 00b6694e2bd2f1de1713f9303fdff5dd63fcda9e 

// project_name: OfficeDev/office-ui-fabric-react 

// flaky_file: /packages/office-ui-fabric-react/src/components/List/List.test.tsx 

// test_affected: https://github.com/microsoft/fluentui/blob/00b6694e2bd2f1de1713f9303fdff5dd63fcda9e/packages/office-ui-fabric-react/src/components/List/List.test.tsx 
// start_line:  130 
// end_line:  137 
xit('invokes optional onRenderCell prop per item render', done => {
  const onRenderCellMock = jest.fn();
  const wrapper = mount(<List items={mockData(100)} />);

  wrapper.setProps({ items: mockData(100), onRenderCell: onRenderCellMock, onPagesUpdated: (pages: IPage[]) => done() });

  expect(onRenderCellMock).toHaveBeenCalledTimes(10);
});
