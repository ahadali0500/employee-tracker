import React, { useEffect, useRef, useCallback } from "react"
import { useLocation } from "react-router-dom"

// //Import Scrollbar
import SimpleBar from "simplebar-react"

// MetisMenu
import MetisMenu from "metismenujs"
import withRouter from "components/Common/withRouter"
import { Link } from "react-router-dom"

const SidebarContent = props => {
  const ref = useRef()
  const activateParentDropdown = useCallback(item => {
    item.classList.add("active")
    const parent = item.parentElement
    const parent2El = parent.childNodes[1]

    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show")
    }

    if (parent) {
      parent.classList.add("mm-active")
      const parent2 = parent.parentElement

      if (parent2) {
        parent2.classList.add("mm-show") // ul tag

        const parent3 = parent2.parentElement // li tag

        if (parent3) {
          parent3.classList.add("mm-active") // li
          parent3.childNodes[0].classList.add("mm-active") //a
          const parent4 = parent3.parentElement // ul
          if (parent4) {
            parent4.classList.add("mm-show") // ul
            const parent5 = parent4.parentElement
            if (parent5) {
              parent5.classList.add("mm-show") // li
              parent5.childNodes[0].classList.add("mm-active") // a tag
            }
          }
        }
      }
      scrollElement(item)
      return false
    }
    scrollElement(item)
    return false
  }, [])

  const removeActivation = items => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i]
      const parent = items[i].parentElement

      if (item && item.classList.contains("active")) {
        item.classList.remove("active")
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
            ? parent.childNodes[1]
            : null
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show")
        }

        parent.classList.remove("mm-active")
        const parent2 = parent.parentElement

        if (parent2) {
          parent2.classList.remove("mm-show")

          const parent3 = parent2.parentElement
          if (parent3) {
            parent3.classList.remove("mm-active") // li
            parent3.childNodes[0].classList.remove("mm-active")

            const parent4 = parent3.parentElement // ul
            if (parent4) {
              parent4.classList.remove("mm-show") // ul
              const parent5 = parent4.parentElement
              if (parent5) {
                parent5.classList.remove("mm-show") // li
                parent5.childNodes[0].classList.remove("mm-active") // a tag
              }
            }
          }
        }
      }
    }
  }

  const path = useLocation()
  const activeMenu = useCallback(() => {
    const pathName = path.pathname
    let matchingMenuItem = null
    const ul = document.getElementById("side-menu")
    const items = ul.getElementsByTagName("a")
    removeActivation(items)

    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i]
        break
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem)
    }
  }, [path.pathname, activateParentDropdown])

  useEffect(() => {
    ref.current.recalculate()
  }, [])

  useEffect(() => {
    new MetisMenu("#side-menu")
    activeMenu()
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    activeMenu()
  }, [activeMenu])

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300
      }
    }
  }
  const data = JSON.parse(localStorage.getItem('expenseCate'));
  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">Menu </li>
            <li>
              <Link to="/dashboard">
                <i className="bx bx-home-circle"></i>
                <span>Dashboards</span>
              </Link>
            </li>
            {data[0].status == 0 ?
              <>
                <li>
                  <Link to="/general-expense">
                    <i className="bx bx-money"></i>
                    <span>{data[0].expense_name}</span>
                  </Link>
                </li>
              </>
              :
              <>
              </>
            }
            {data[1].status == 0 ?
              <>
                <li>
                  <Link to="/business-expense">
                    <i className="bx bx-money"></i>
                    <span>{data[1].expense_name}</span>
                  </Link>
                </li>
              </>
              :
              <>
              </>
            }

            {data[1].department == 0 ?
              <>
                <li>
                  <Link to="/department">
                    <i className="bx bx-buildings"></i>
                    <span>Departments</span>
                  </Link>
                </li>

                <li>
                  <Link to="/department-tools">
                    <i className="bx bx-customize"></i>
                    <span>Departments Tools</span>
                  </Link>
                </li>

                <li>
                  <Link to="/employee">
                    <i className="bx bx-user-voice"></i>
                    <span>Employee</span>
                  </Link>
                </li>
              </>
              :
              <></>
            }
            <li>
              <Link to="/bank">
                <i className="bx bxs-bank"></i>
                <span>Banks</span>
              </Link>
            </li>
            {data[1].everyday == 0 ?
              <>
                <li>
                  <Link to="/everday-expenses">
                    <i className="bx bx-money"></i>
                    <span>Everday Expenses</span>
                  </Link>
                </li>
              </>
              :
              <></>
            }
            <li>
              <Link to="/users">
                <i className="bx bx-user-pin"></i>
                <span>Users</span>
              </Link>
            </li>
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  )
}

export default SidebarContent
