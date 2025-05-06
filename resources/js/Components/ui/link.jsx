import * as Headless from '@headlessui/react'
import React, { forwardRef } from 'react'
import { Link as InertiaLink } from '@inertiajs/react'

export const Link = forwardRef(function Link(props, ref) {
  return (
    <Headless.DataInteractive>
      <InertiaLink {...props} ref={ref} />
    </Headless.DataInteractive>
  )
})
