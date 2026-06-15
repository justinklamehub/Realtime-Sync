import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/lib/socket";
import { 
  getListShipmentsQueryKey, 
  getListPalletMovementsQueryKey, 
  getListPalletBalancesQueryKey,
  getListSpeditionenQueryKey,
  getListUsersQueryKey,
} from "@workspace/api-client-react";

export function useSocket() {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // Shipment events
    const invalidateShipments = () => queryClient.invalidateQueries({ queryKey: getListShipmentsQueryKey() });
    socket.on("shipment.created", invalidateShipments);
    socket.on("shipment.updated", invalidateShipments);
    socket.on("shipment.status_changed", invalidateShipments);
    socket.on("shipment.locked", invalidateShipments);
    socket.on("shipment.unlocked", invalidateShipments);

    // Pallet events
    const invalidatePallets = () => {
      queryClient.invalidateQueries({ queryKey: getListPalletMovementsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getListPalletBalancesQueryKey() });
    };
    socket.on("pallet_movement.created", invalidatePallets);
    socket.on("pallet_balance.updated", invalidatePallets);

    // Permission / Spedition events
    const invalidateSpeditionen = () => queryClient.invalidateQueries({ queryKey: getListSpeditionenQueryKey() });
    socket.on("permission.updated", invalidateSpeditionen);

    // User events
    const invalidateUsers = () => queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
    socket.on("user.updated", invalidateUsers);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("shipment.created", invalidateShipments);
      socket.off("shipment.updated", invalidateShipments);
      socket.off("shipment.status_changed", invalidateShipments);
      socket.off("shipment.locked", invalidateShipments);
      socket.off("shipment.unlocked", invalidateShipments);
      socket.off("pallet_movement.created", invalidatePallets);
      socket.off("pallet_balance.updated", invalidatePallets);
      socket.off("permission.updated", invalidateSpeditionen);
      socket.off("user.updated", invalidateUsers);
    };
  }, [queryClient]);

  return { isConnected };
}
