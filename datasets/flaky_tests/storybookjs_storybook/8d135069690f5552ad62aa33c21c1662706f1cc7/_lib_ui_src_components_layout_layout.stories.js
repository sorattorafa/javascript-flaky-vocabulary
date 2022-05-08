// https://github.com/storybookjs/storybook/blob/8d135069690f5552ad62aa33c21c1662706f1cc7/lib/ui/src/components/layout/layout.stories.js 

// blob: 8d135069690f5552ad62aa33c21c1662706f1cc7 

// project_name: storybookjs/storybook 

// flaky_file: /lib/ui/src/components/layout/layout.stories.js 

// test_affected: https://github.com/storybookjs/storybook/blob/8d135069690f5552ad62aa33c21c1662706f1cc7/lib/ui/src/components/layout/layout.stories.js 
// start_line:  8 
// end_line: 165 
import { isChromatic } from 'storybook-chromatic/isChromatic';

import { Desktop } from './desktop';
import { Mobile } from './mobile';

import Sidebar from '../sidebar/Sidebar';
import Panel from '../panel/panel';
import { Preview } from '../preview/preview';

import { panels } from '../panel/panel.stories';
import { previewProps } from '../preview/preview.stories';

import { mockDataset } from '../sidebar/treeview/treeview.mockdata';
import { store } from './persist';

const realNavProps = {
  title: 'Title',
  url: 'https://example.com',
  stories: mockDataset.withRoot,
  menu: [],
};

const PlaceholderBlock = styled.div(({ color }) => ({
  background: color || 'hotpink',
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
}));

class PlaceholderClock extends Component {
  state = {
    count: 1,
  };

  componentDidMount() {
    this.interval = setInterval(() => {
      const { count } = this.state;
      this.setState({ count: count + 1 });
    }, 1000);
  }

  componentWillUnmount() {
    const { interval } = this;
    clearInterval(interval);
  }

  render() {
    const { children, color } = this.props;
    const { count } = this.state;

    return (
      <PlaceholderBlock color={color}>
        <h2
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            color: 'rgba(0,0,0,0.2)',
            fontSize: '150px',
            lineHeight: '150px',
            margin: '-20px',
          }}
        >
          {count}
        </h2>
        {children}
      </PlaceholderBlock>
    );
  }
}
PlaceholderClock.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
};

const MockNav = props => (
  <PlaceholderClock color="hotpink">
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </PlaceholderClock>
);
const MockPreview = props => (
  <PlaceholderClock color="deepskyblue">
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </PlaceholderClock>
);
const MockPanel = props => (
  <PlaceholderClock color="orangered">
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </PlaceholderClock>
);
const MockPage = props => (
  <PlaceholderClock color="cyan">
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </PlaceholderClock>
);

const mockProps = {
  Nav: MockNav,
  Preview: MockPreview,
  Panel: MockPanel,
  Notifications: () => null,
  pages: [],
  options: { isFullscreen: false, showNav: true, showPanel: true, panelPosition: 'right' },
  path: '/story/UI-DesktopLayout-noNav',
  viewMode: 'story',
  storyId: 'UI-DesktopLayout-noNav',
  panelCount: 2,
};

const realProps = {
  Nav: () => <Sidebar {...realNavProps} />,
  Preview: () => <Preview {...previewProps} />,
  Notifications: () => null,
  Panel: () => (
    <Panel
      panels={panels}
      actions={{ onSelect: () => { }, toggleVisibility: () => { }, togglePosition: () => { } }}
      selectedPanel="test2"
    />
  ),
  pages: [],
  options: { isFullscreen: false, showNav: true, showPanel: true, panelPosition: 'right' },
  path: '/story/UI-DesktopLayout-noNav',
  viewMode: 'story',
  storyId: 'UI-DesktopLayout-noNav',
  panelCount: 2,
};

storiesOf('UI|Layout/Desktop', module)
  .addParameters({
    component: Desktop,
  })
  .addDecorator(withKnobs)
  .addDecorator(storyFn => {
    const mocked = boolean('mock', true);
    const height = number('height', 1200);
    const width = number('width', 1200);

    if (isChromatic) {
      store.local.set(`storybook-layout`, {});
    }

    const props = {
      height,
      width,
      ...(mocked ? mockProps : realProps),
    };

    return <div style={{ minHeight: 1200, minWidth: 1200 }}>{storyFn({ props })}</div>;
  })
