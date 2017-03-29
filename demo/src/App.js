import React from 'react'
import {
  HashRouter as Router,
  Route,
  Link,
  matchPath,
  withRouter
} from 'react-router-dom'
import crate from './crate'
import Loading from './Loading'
import { Motion } from '../../src'
import colors from 'open-color'
import TrippyDemo from './demos/Trippy'
import ListDemo from './demos/List'
import Streamgraph from './demos/Scatterplot'

const WOBBLY_SPRING = { stiffness: 350, damping: 15, precision: 0.1 }

const ApiDocs = crate.asyncCompile({
  loader: () => import('./docs/Api'),
  LoadingComponent: Loading,
  delay: 200
})

// const TrippyDemo = crate.asyncCompile({
//   loader: () => import('./demos/Trippy'),
//   LoadingComponent: Loading,
//   delay: 200
// })
//
// const ListDemo = crate.asyncCompile({
//   loader: () => import('./demos/List'),
//   LoadingComponent: Loading,
//   delay: 200
// })

const HomePage = ({ style }) => {
  return (
    <div style={style} className={'home-page markdown-body scrollable'}>
      <div className={'home-page-inner'}>
        <h2>data-driven-motion</h2>
        <p>Easily animate your data in react</p>
        <pre>
          npm install -S data-driven-motion
        </pre>
        <ul
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            listStyle: 'none',
            flex: '1 0 auto'
          }}
        >
          <li>
            <Link to='/demos'>Demos</Link>
          </li>
          <li><Link to='/docs'>Docs</Link></li>
          <li>
            <a
              href='https://github.com/tkh44/data-driven-motion'
              target={'_blank'}
            >
              Github
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

const DemosPage = ({ style }) => (
  <div style={style} className={'demo-page markdown-body scrollable'}>
    <div className={'demo-page-inner'}>
      <h3>
        Scatter Plot
        <a
          href='https://github.com/tkh44/data-driven-motion/blob/master/demo/src/demos/Scatterplot.js'
          target={'_blank'}
        >
          Source
        </a>
      </h3>
      <Streamgraph />
      <hr />
      <h3>
        Trippy Perspective
        <a
          href='https://github.com/tkh44/data-driven-motion/blob/master/demo/src/demos/Trippy.js'
          target={'_blank'}
        >
          Source
        </a>
      </h3>
      <TrippyDemo />
      <hr />
      <h3>
        List with multiple layers
        <a
          href='https://github.com/tkh44/data-driven-motion/blob/master/demo/src/demos/List.js'
          target={'_blank'}
        >
          Source
        </a>
      </h3>
      <ListDemo />
    </div>
  </div>
)

const AnimationExample = () => (
  <Router>
    <div className={'full'}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingRight: 16,
          paddingLeft: 16,
          height: 48
        }}
      >
        <h1 style={{ color: colors.green[6] }}>
          <Link to='/'>data-driven-motion</Link>
        </h1>
        <ul
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            listStyle: 'none',
            flex: '1 0 auto'
          }}
        >
          <li>
            <Link to='/demos'>Demos</Link>
          </li>
          <li><Link to='/docs'>Docs</Link></li>
          <li>
            <a
              href='https://github.com/tkh44/data-driven-motion'
              target={'_blank'}
            >
              Github
            </a>
          </li>
        </ul>
      </header>
      <AnimatedSwitch style={{ position: 'relative' }}>
        <AnimatedRoute exact path='/' component={HomePage} />
        <AnimatedRoute path='/demos' component={DemosPage} />
        <AnimatedRoute path='/docs' component={ApiDocs} />
      </AnimatedSwitch>
    </div>
  </Router>
)

const AnimatedSwitch = withRouter(
  class AnimatedSwitch extends React.Component {
    render () {
      const { children, route, style } = this.props
      const location = this.props.location || this.context.route.location
      let match, child
      React.Children.forEach(children, element => {
        if (!React.isValidElement(element)) return

        const { path: pathProp, exact, strict, from } = element.props
        const path = pathProp || from

        if (match == null) {
          child = element
          match = path
            ? matchPath(location.pathname, { path, exact, strict })
            : route.match
        }
      })

      return (
        <Motion
          data={match ? [{ location, match, child }] : []}
          component={<div style={style} className={'full'} />}
          render={(key, data, style) => {
            return React.cloneElement(data.child, {
              key,
              location: data.location,
              computedMatch: data.match,
              style: {
                transform: `translate3d(0, ${style.y}%, 0)`,
                opacity: style.o
              }
            })
          }}
          getKey={({ child, location, match }) => {
            return child.props.getKey // param values used when generating keys
              ? child.props.getKey({ location, match })
              : child.props.path || child.props.from
          }}
          onComponentMount={data => ({ y: 50, o: 0.75 })}
          onRender={(data, i, spring) => ({
            y: spring(0, WOBBLY_SPRING),
            o: spring(1)
          })}
          onRemount={({ data: { child } }) => ({ y: 5, o: 0 })}
          onUnmount={({ data: { child } }, spring) => ({
            y: spring(20, WOBBLY_SPRING),
            o: spring(0)
          })}
        />
      )
    }
  }
)

const AnimatedRoute = ({ component: Component, style, getKey, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => (
        <Component
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: 'calc(100% - 32px)',
            width: 'calc(100% - 32px)',
            padding: 16,
            ...props.style,
            ...style
          }}
        />
      )}
    />
  )
}

export default AnimationExample
