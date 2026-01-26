# TODO - Mapa Component: Role-based Position Updates

## Objective
Update driverPosition and deliveryPosition based on user role for location sharing.

## Changes Implemented in src/app/pages/mapa/mapa.component.ts:

### 1. Added helper method to parse position strings ✅
- Created `parsePosition(positionStr: string | null | undefined)` method
- Converts "lat,lng" strings to {lat, lng} objects

### 2. Added loadAsignacion() method ✅
- Fetches asignacion by ID from route params
- Parses driverPosition and deliveryPosition from asignacion data
- Sets positions based on user role

### 3. Modified ngOnInit geolocation subscription ✅
- **For CHOFER**: Updates driverPosition with GPS, deliveryPosition from asignacion
- **For USER**: Only displays positions from asignacion (no GPS overwrite)

### 4. Added startRefreshAsignacion() method ✅
- For USER role, refreshes asignacion every 10 seconds
- Updates driver's position on map when it changes

### 5. Added updateAsignacionWithPosition() method ✅
- Silently updates driver's position to the server
- Called on each geolocation update for CHOFER

### 6. Cleanup in ngOnDestroy ✅
- Unsubscribe from asignacionSubscription
- Clear refresh interval

## Implementation Status: COMPLETED ✅


